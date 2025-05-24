import React from "react"
import '../css/mainpage.css'
import BreadCrumb from '../components/BreadCrumb'
import CenterPage from '../components/CenterPage'

const MainPage = () => {
  return (
    <main>
      <BreadCrumb currentPage={"Home"} />
      <CenterPage />
    </main>
  )
}

export default MainPage