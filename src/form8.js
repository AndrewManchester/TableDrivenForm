import React, { useState } from 'react';
import { Table } from "react-bulma-components";
import { Button } from "react-bulma-components";
import { Form } from "react-bulma-components";
import { Heading } from "react-bulma-components";



const TheInput2 = (props) => {

 const handleValueChange = (event) =>  {
    event.preventDefault();
    props.passValueUp(event.target.value, props.status.id)
  }
   
   const handleValueChangeCheckBox = (aBoolean) =>  {
    const x = (aBoolean.localeCompare("true")  === 0) ? "false" : "true"
    props.passValueUp(x, props.status.id)
  }
 
 
  const handleValueChangeRadio = (aString) =>  {
    props.passValueUp(aString, props.status.id)
  }
   
  const paintRadio = () => {
      return (
     
      <div  className="control">
        {  props.status.other.map((selectableItem, index) => { return (
            <label className="radio" key={index}>
            <input onChange={() => handleValueChangeRadio(selectableItem)} type="radio" name="answer"/>
            {selectableItem }
            </label>
         )}
         )}
          </div> 
       
      )
   }
          
  const paintInput = () => {
    return (
      <React.Fragment>
      <label>{props.status.label}</label>
      <Form.Input type="text" value={props.status.value} onChange={handleValueChange}/> 
      </React.Fragment>
    )
  }
  const paintCheckbox = () => {
    return (
      <React.Fragment>
      <input type="checkbox" value={props.status.value} onClick={() => handleValueChangeCheckBox(props.status.value)}/> 
      <label>{props.status.label}</label>
     </React.Fragment>
    )
  }
  
  const paintSelect = () => {
    return (
      <div>
      <label>{props.status.label}</label>
      <select className="theSelect" defaultValue={'DEFAULT'} onChange={handleValueChange}>
      <option disabled value={'DEFAULT'}>-- Select Card Type --</option>
      {props.status.other.map( (option, index) => {
         return <option value={option} key={index}>{option}</option>
        }
       )}}
      </select> 
      </div>  
    )
  }
  
  const inputSelector = () => {
    if (props.status.type.localeCompare("INPUT") === 0) {
         return (paintInput())
    }
    else if (props.status.type.localeCompare("SELECT") === 0) {
         return paintSelect()
    }
    else if (props.status.type.localeCompare("CHECKBOX") === 0) {
          return paintCheckbox()
    }
    else 
         return paintRadio()
  }      
  
 return (
     <React.Fragment>
     {inputSelector()}
     {props.status.showError ? <div className="alert">{props.status.error}</div> : null }
     </React.Fragment>
  )

}


function Form8() {

  const emailRegx = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/); 
  const nameRegx = new RegExp(/^([a-z]+[,.]?[ ]?|[a-z]+['-]?)+$/); 
  const INPUT = "INPUT"
  const SELECT = "SELECT"
  const CHECKBOX = "CHECKBOX"
  const RADIO = "RADIO"

  const initialStatus = [
    { id:0,   valid: false,                  
              checker: (value) => value.length >= 4 && nameRegx.test(value),
              error: "4 or more characters",
              value:  "",
              type: INPUT,
              other: "",
              label: "Name on Card", 
              showError: false
    },
    { id:1,   valid: false,
              checker: (value) => emailRegx.test(value), 
              error: "Invalid email",
              value: "", 
              type: INPUT,
              other: "",
              label: "Email Address",
              showError: false
    },
    { id:2,   valid: false,
              checker: (value) => value.length >= 4 && /^[0-9]*$/.test(value), 
              error: "4 or more digits",
              value: "", 
              type: INPUT,
              other: "",
              label: "Card Number",
              showError: false
    },
    { id:3,   valid: false,
              checker: (value) => value.length >= 1, 
              error: "Please select a card type",
              value: "",  
              type: SELECT,
              other: ["Visa","Master Card"],
              label: "Select Card Type",
              showError: false
    },
    { id:4,   valid: false,
              checker: (value) => (value.localeCompare("true") === 0), 
              error: "To continue you must accept",
              value: "", 
              type: CHECKBOX,
              other: "",
              label: "You agree to the term and conditions",
              showError: false
    },
    { id:5,   valid: false,
              checker: (value) => value.length >= 1, 
              error: "Please select one",
              value: "", 
              type: RADIO,
              other: ["yes","no"],
              label: "Yes No",
              showError: false
    }

   ] 

  const [status, setStatus] = useState(initialStatus)
  const [formValid, setFormValid] = useState(false)
  const prepareStatusForUpdate = (key, data) =>
             status.map((item) => {
                   if (key === item.id) {
                     return {...item, ...{value: data,
                                          valid: item.checker(data) ,
                                          showError: false}} //clear error
                                          //as user types in at the input
                   } 
                  else {
                     return item
                  }
          })
  
  
  const passValueUp = (data, key) => { 
      console.log(data)
      const preparedData = prepareStatusForUpdate(key, data)
      setStatus(preparedData)
       //Can not pass status into the reduce?   
      setFormValid( preparedData.reduce ((accum, item )  => {
        return accum && item.valid},true)
      )
  }
      
                                
  const theSubmit = () => {
     if (!formValid) {
      setStatus( status.map( (item) => {
         if (!item.valid) {
           item.showError = true
         }
         return item
      }))
     }
  }
  
  
  
 const statusMonitor = () =>  {
   return (
    <div className="main">
    <Heading size={4} className="heading-set">Payment Form Status</Heading>
     <Table>
       <thead>
        <tr>
          <th className="">
           Input
          </th>
          <th className="validity">
           Validity
          </th>
          <th className="value">
           Value
          </th>
        </tr> 
        </thead>
        <tbody>
      {status.map(item => (
        <tr key={item.id}>
          <td>
           {item.label} 
          </td>
          <td className={ item.valid ? "set-green" : "set-red"}>
            {item.valid ? "true" : "false"}
          </td>
          <td>
            {item.value}
          </td>
        </tr> 
      ))}
    
       <tr>
        <td>Submit</td>
        <td className={ formValid ? "set-green" : "set-red"}>
          {formValid ? "true" : "false"}</td>
        <td>{formValid ? "Form OK" : "Form has errors"}</td>
      </tr>
      </tbody>
    </Table>
    </div>
   )}
   
   
    const actualForm = () => {
    return (
      <div className="main">
        <div>
        <Heading size={4} className="heading-set">Payment Form</Heading>
        </div>
        {status.map((item, index) => {
           return (
            <div className="theInput" key={index}>
              <TheInput2  
                passValueUp={passValueUp} 
                status={item}
              />
            </div>         
           
           )
         })}
         
        <div className="wrapper">
          <Button onClick={theSubmit}>Pay Now
          </Button>
         </div>
      </div>

    
     )
   }
  
  


 return (
   //Set up 4 columns.
   <div id="parent">
      <div></div> 
      {actualForm()} 
      <div></div> 
      {statusMonitor()}
    </div>
      
  );
};

 

export default Form8;
