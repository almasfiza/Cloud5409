import React from 'react'

export default function Header(props) {
  return (
    <div className="Header">
        <h1>{props.title}</h1>
        <p>{props.desc}</p>
    </div>
  )
}
