import React from "react";
import PropTypes from "prop-types";
import "./UserCard.css";

const UserCard = ({
  user,
  showEmail = true,
  showBio = true,
  theme = "light",
  onContactClick,
}) => {
  if (!user) {
    return (
      <div className="user-card user-card--empty">
        <p>NO USER DATA DETAILS</p>
      </div>
    );
  }

  const { name, email, bio, avatarUrl, role, isActive } = user;

  return (
    <div className={`user-card user-card--${theme}`}>
      <div className="user-card__header">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${name}'s avatar`}
            className="user-card__avatar"
          />
        ) : (
          <div className="user-card__avatar-placeholder">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="user-card__status">
          <span
            className={`status-indicator ${
              isActive
                ? "status-indicator--active"
                : "status-indicator--inactive"
            }`}
          />
          {isActive ? "Active" : "Inactive"}
        </div>
      </div>

      <div className="user-card__body">
        <h2 className="user-card__name">{name}</h2>
        {role && <p className="user-card__role">{role}</p>}

        {showEmail && email && (
          <p className="user-card__email">
            <span className="user-card__label">Email:</span> {email}
          </p>
        )}

        {showBio && bio && <p className="user-card__bio">{bio}</p>}
      </div>

      <div className="user-card__footer">
        <button
          onClick={onContactClick}
          className="user-card__button"
          aria-label={`Contact ${name}`}
        >
          Contact
        </button>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    bio: PropTypes.string,
    avatarUrl: PropTypes.string,
    role: PropTypes.string,
    isActive: PropTypes.bool,
  }),
  showEmail: PropTypes.bool,
  showBio: PropTypes.bool,
  theme: PropTypes.oneOf(["light", "dark"]),
  onContactClick: PropTypes.func,
};

export default UserCard;
