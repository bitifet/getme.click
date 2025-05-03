
import bcrypt from 'bcrypt';
import {randomUUID} from 'crypto';

// Mock database (replace with real DB later)
const users = [];

export async function signup( username, password, password_confirm ) {
  if (users.find(u => u.username === username)) throw new Error('User already exists');
  if (password !== password_confirm) throw new Error('Password mismatch');
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: randomUUID(), username, password: hashedPassword, provider: 'local' };
  users.push(user);
  return user;
};

export async function authenticate(username, password) {
    const foundUser = users.find(u => u.username === username);
    if (!foundUser) {
        return false;
    }
    return (
        bcrypt.compare(password, foundUser.password)
        && foundUser
    );
};


