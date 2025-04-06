
const bcrypt = require('bcrypt');
const {randomUUID} = require('crypto');

// Mock database (replace with real DB later)
const users = [];

async function signup( username, password, password_confirm ) {
  if (users.find(u => u.username === user)) throw new Error('User already exists');
  if (password !== password_confirm) throw new Error('Password mismatch');
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: randomUUID(), username, password: hashedPassword, provider: 'local' };
  users.push(user);
  return user;
};

async function authenticate(user, password) {
    const foundUser = users.find(u => u.username === user);
    if (!foundUser) {
        return false;
    }
    return (
        bcrypt.compare(password, foundUser.password)
        && foundUser
    );
};


module.exports = {
    signup,
    authenticate,
};

