import React, {useState} from 'react';

//FRONTEND VERSION
export default function Input(){ //added default
    const [inputRange, setInputRange] = useState(0)
    //<BE> -- or is it?
    const [inRangePartners, setInRangePartners] = useState(<div></div>)
    //</BE>
    return(
        <div>
        <input type="number" placeholder="Enter Range (Km)" onChange={OnChangeHandle} />
        <button onClick={() => OnButtonClicked()}>Display</button>
        <br/>
        <ul>
            {inRangePartners}
        </ul>
        </div>
    ); //hello

    function OnChangeHandle(inputData){
        setInputRange(inputData.target.value)
    }

    function OnButtonClicked(){
        const url = "/api/fetchData" //* don't need to send data here (as a route inside url)
        const apiPort = 9000
        let validPartners = null
        //*<newCode>

        fetch("http://localhost:" + apiPort.toString() + url, {
            method: 'POST',
            body: JSON.stringify({inputRange: inputRange}),
            headers: {'Content-Type': 'application/json'}
        })//TODO: Catch for errors
        .then((res)=>{
            res.json().then((res)=>{
            //*res: object with keys: data (partners data) and confirmation (success or fail)
            validPartners = JSON.parse(res.data).map(DisplayPartner)
            setInRangePartners(validPartners)
        })
        .catch(err=>{
            console.log("Error in receiving response from server:\n" + err)
        })
            
        })
    }
   
    function DisplayPartner(partner){
        //displays Partner company name, location(s) and address(es)
        //partner =  {organization (companyName), branches} 
        //where branches is an array == [{location, address, coordinates}]
        //display in the following format:
        //company name
        // for each office:
        //  office#, address
        return(
            <li>
                <h2 align="left">{partner.organization}</h2>
                <ul align="left">
                    {partner.branches.map((branch, index) => {
                        return(//must label out-of-range office!
                        <li>Office #{index+1}
                        <ul>
                            <li>Location: {branch.location}</li>
                            <li>Address: {branch.address}</li>
                        </ul>
                        </li>
                        );
                    })}
                </ul>
            </li>
        );
    }
}