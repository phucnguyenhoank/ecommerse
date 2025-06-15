import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import '../styles/Breadcrumb.css';

const Breadcrumb = ({title}:{title:string}) => {
  const navigate = useNavigate();

  return (
    <div className="breadcrumb-container">
      <span className="breadcrumb-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={30} className="breadcrumb-icon" />
      </span>
      <span>{title}</span>
    </div>
  );
};

export default Breadcrumb;
