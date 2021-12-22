import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'

function CountrySelector() {
  const [value, setValue] = useState('')
  const [bank, setBank] = useState(undefined)
  const options = useMemo(() => countryList().getData(), [])
  
  const changeHandler = value => {
    setValue(value)
    
  }
  const banks = [{"id":132,"code":"560","name":"Page MFBank"},{"id":133,"code":"304","name":"Stanbic Mobile Money"}]

  const emeka = banks.map((bank, index)=>{
      return (
          <option value={bank.code} key={index}>{bank.name}</option>
      )
  })

  let chidera = [] 
  banks.map((bank)=>{
      chidera.push({value:bank.code, label:bank.name})
  })
  const handleThis = (e)=>{
    console.log(e.target.value)
  }

  return (
      <>
        <Select options={options} value={value} onChange={changeHandler} />

        <select onChange={handleThis}>
            {emeka}
        </select>

        <Select options={chidera} value={bank}  onChange={bank=>setBank(bank)}/>
      </>
  )
}

export default CountrySelector