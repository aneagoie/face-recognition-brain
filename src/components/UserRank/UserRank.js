import React from 'react';

const UserRank = ({ user }) => {
  return (
    <div>
      <div className="white f3">
        {`${user.username}, your current rank is...`}
      </div>
      <div className="white f1">
        {`#${user.rank}`}
      </div>
    </div>
  );
}

export default UserRank;