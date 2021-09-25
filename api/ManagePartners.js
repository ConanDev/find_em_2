import { Input } from './input_range';
const partners = require('./partners.json')

export function DisplayStats(){
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

    return (
        <div>
        <Input partners={allCompanies}  />
        </div>
    );
}