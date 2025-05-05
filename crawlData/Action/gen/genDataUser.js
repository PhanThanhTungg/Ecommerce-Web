import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";

export default async () => {
  const users = [];
  for (let i = 0; i < 153; i++) {
    try {
      const user = {};
      const typeLogin = Math.ceil(Math.random() * 4);
      if (typeLogin === 1) {
        user.facebookId = faker.string.uuid();
      } else if (typeLogin === 2) {
        user.googleId = faker.string.uuid();
      } else if (typeLogin === 3) {
        user.githubId = faker.string.uuid();
      }

      user.fullName = faker.person.fullName();
      user.email = faker.internet.email();
      if (typeLogin === 4)
        user.password = bcrypt.hashSync(faker.internet.password(), 10);
      user.phone = faker.phone.number();
      user.thumbnail = faker.image.avatar;
      user.sex = faker.helpers.weightedArrayElement([
        { value: 'male', weight: 60 },
        { value: 'female', weight: 35 },
        { value: 'other', weight: 5 }
      ]);
      user.status = "active";
      user.deleted = false;
      // user.createdAt trong khoảng từ từ 01/02/2025 đến 28/02/2025 và bản ghi sau có thời gian lớn hơn hoăc bằng bản ghi trước
      user.createdAt = user.createdAt = faker.date.between({ from: '2025-02-01', to: '2025-02-28' });
      users.push(user);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Error: ");
      continue;
    }
  }
  users.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return users;
}