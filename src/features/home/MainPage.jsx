import React from "react"
import BreadCrumb from '../../components/ui/BreadCrumb'
import CenterPage from './CenterPage'
import '../../css/mainpage.css'

const MainPage = () => {
  return (
    <main>
      <BreadCrumb currentPage={"Home"} />
      <CenterPage />
    </main>
  )
}

export default MainPage