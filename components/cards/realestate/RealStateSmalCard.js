import React from "react";
import Stars from "../../others/Stars";
import Styles from "../../styles/SmallCard.module.css"
import SmallCard from "../SmallCard"

class RealStateSmalCard extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickCall = () => {
    if (this.props.realstate.phone) {
      window.location.href = `tel:${this.props.realstate.phone}`;
    } else {
      alert('شماره تماس موجود نیست');
    }
  }

  render() {
    return <SmallCard realEstate={this.props.realstate} compact={this.props.compact} />
  }
}

export default RealStateSmalCard;