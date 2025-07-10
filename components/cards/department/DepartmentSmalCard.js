import React from "react";
import PropTypes from "prop-types";
import Stars from "../../others/Stars";
<<<<<<< HEAD
import Styles from "../../styles/RealStateCard.module.css";
=======
import SmallCard from "../SmallCard";
>>>>>>> a6b1c29616623faba10577384ad1bca1dcbff403

class DepartmentSmalCard extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickCall() {
    console.log("call button clicked");
  }

  render() {
<<<<<<< HEAD
    return (
      <div className={` ${Styles["profile-card"]} 'pe-2' `}>
        <div className={Styles["profile-info"]}>
          <img
            className={Styles["profile-pic"]}
            src={this.props.department.avatar}
            alt={this.props.department.name }
          />

          <h2 className={Styles["hvr-underline-from-center"]}>
            {this.props.department.name}
            <span>
              <Stars amount={this.props.department.stars} />
            </span>
          </h2>
          <div className={Styles["profile-description"]}>
            <p className={Styles["show-on-hover"]}>
              {this.props.department.description}
            </p>
          </div>
          <div className={Styles["profile-contacts-wrapper"]}>
            <a
              onClick={this.onClickCall}
              className={Styles["show-on-hover"]}
              href={
                "https://api.whatsapp.com/send?phone=" +
                this.props.department.head_phone +
                "&text=سلام"
              }
            >
              <i className="fa fa-whatsapp fa-2x"></i>
            </a>
            <a
              className={Styles["show-on-hover"]}
              target="_blank"
              rel="noreferrer"
              href={"tel:" + this.props.department.head_phone}
            >
              <i className="fa fa-phone fa-2x "></i>
            </a>
          </div>
        </div>
      </div>
    );
=======
    return <SmallCard realEstate={this.props.department} profileImageKey="avatar" />
>>>>>>> a6b1c29616623faba10577384ad1bca1dcbff403
  }
}

export default DepartmentSmalCard;
<<<<<<< HEAD
=======


// render() {
//   return (
//     <div className={` ${Styles["profile-card"]} 'pe-2' `}>
//       <div className={Styles["profile-info"]}>
//         <img
//           className={Styles["profile-pic"]}
//           src={this.props.department.avatar}
//           alt={this.props.department.name }
//         />

//         <h2 className={Styles["hvr-underline-from-center"]}>
//           {this.props.department.name}
//           <span>
//             <Stars amount={this.props.department.stars} />
//           </span>
//         </h2>
//         <div className={Styles["profile-description"]}>
//           <p className={Styles["show-on-hover"]}>
//             {this.props.department.description}
//           </p>
//         </div>
//         <div className={Styles["profile-contacts-wrapper"]}>
//           <a
//             onClick={this.onClickCall}
//             className={Styles["show-on-hover"]}
//             href={
//               "https://api.whatsapp.com/send?phone=" +
//               this.props.department.head_phone +
//               "&text=سلام"
//             }
//           >
//             <i className="fa fa-whatsapp fa-2x"></i>
//           </a>
//           <a
//             className={Styles["show-on-hover"]}
//             target="_blank"
//             rel="noreferrer"
//             href={"tel:" + this.props.department.head_phone}
//           >
//             <i className="fa fa-phone fa-2x "></i>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }


>>>>>>> a6b1c29616623faba10577384ad1bca1dcbff403
