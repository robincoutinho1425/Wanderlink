import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./UserItem.css";
import { Link } from "react-router-dom";
const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/profile/${props.id}`}>
          <div className="user-item__image">
            <Avatar
              image={`${import.meta.env.VITE_IMAGE_URL}/${props.image}`}
              alt={props.name}
            />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h2>
              {props.placeCount}
              {props.placeCount === 1 ? "Place" : "Places"}
            </h2>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
