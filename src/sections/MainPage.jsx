import React from "react"
import '../css/mainpage.css'
import BreadCrumb from '../components/ui/BreadCrumb'
import CenterPage from '../features/home/CenterPage'

const MainPage = () => {
  return (
    <main>
      <BreadCrumb currentPage={"Home"} />
      <CenterPage />
    </main>
  )
}

export default MainPage