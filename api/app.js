const express = require('express');
const cors = require('cors')

const Router = express()
const selfCoor = [51.5144636,-0.142571] //coordinates of our own office
const partners = require('./partners.json')
const allCompanies = GetData()
let validPartners = null
let inputRange = -1

Router.use(cors())
Router.use(express.json());

function GetData(){
  let allCompanies = []
  partners.forEach((p1) => {
      const organization = p1.organization
      //for each partner, we have "prop" =  {companyName, branches}
      //where branches is an array == [{location, address, coordinates}]
      let branches = []
      let prop = {organization: organization, branches : branches}
      //this is the inner ForEach for the branches
      const offices = p1.offices

      offices.forEach(office => {
          //for each office, add its location, address, and coordinates
          branches.push({
              location : office.location,
              address : office.address,
              coordinates : office.coordinates.split(',')})
      })
      allCompanies.push(prop)
  })
  return allCompanies
}

//*<newCode>
Router.post('/api/fetchData', (req, res) => {
  if(!req){
    res.json({
      data: null,
      confirmation: 'fail'
    })
  }
  else{
    //had to stringify then re-convert to object to get rid of "undefined"
    const received = JSON.stringify(req.body)
    const receivedObject = JSON.parse(received)
    inputRange = parseFloat(receivedObject.inputRange)
    validPartners = PartnersInRange(allCompanies)
    validPartners = JSON.stringify(validPartners)

    res.json({
      data : validPartners,
      confirmation : 'success'
    })
  }
  
})
//*</newCode>

function DegreesToRadians(deg){
    return deg * Math.PI / 180
  }
  
function GCD(_p1, _p2){
  //calculates the Great Circle Distance between points _p1 and _p2
  //the latter need to be converted to radians
  const r = 6371009 // earth mean radius => minimized errors
  const p1 = _p1.map(DegreesToRadians)
  const p2 = _p2.map(DegreesToRadians)
  const a = Math.sin(p1[1]) * Math.sin(p2[1])
  const b = Math.cos(p1[1]) * Math.cos(p2[1])
  const c = Math.cos(p1[0] - p2[0])
  const del_sigma = Math.acos(a*b + c)
  const dist = r * del_sigma
  return dist / 1000 //meters to Km
}

function PartnersInRange(partners){
  //filters all partners according to range
  //returns an array of in-range partners
  //sorted according to company name
  let inRangePartners = [...partners].filter(CheckValidPartner)
  inRangePartners.forEach(EnsureValidOffices)
  inRangePartners.sort(SortPartners)
  return inRangePartners//.map(DisplayPartner) this is the frontend job
}

function CheckValidPartner(partner){
  //check if a certain (single) partner is in-range
  //must check all offices of this partner
  //if one is in range, then true. if none, false
  let isValid = false
  // let partner = [..._partner]
  // partner = JSON.parse(partner)
  for (const branch of partner.branches){
      const dist = GCD(selfCoor, branch.coordinates.map(coor => parseFloat(coor)))
      if(dist <= inputRange){
          isValid = true
          break
      }
  }
  return isValid
}

function EnsureValidOffices(partner){
  //only accept in-range offices of a certain partner
  const validBranches = partner.branches.filter((branch) => {
      return GCD(branch.coordinates, selfCoor) <= inputRange
  })
  
  let res = partner
  res.branches = validBranches
  return res
}
  
function SortPartners(p1, p2){
  //sorts partners according to company name
  return p1.organization < p2.organization ? -1 : 1;
}

module.exports = Router;