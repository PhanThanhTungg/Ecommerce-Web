import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";

export default async (yearMonth) => {
  const users = [];
  const irandom = Math.floor(Math.random() * (80 - 35 + 1)) + 35;
  for (let i = 0; i < irandom; i++) {
    try {
      const user = {};
      //type
      const typeLogin = Math.ceil(Math.random() * 4);
      if (typeLogin === 1) {
        user.facebookId = faker.string.uuid();
      } else if (typeLogin === 2) {
        user.googleId = faker.string.uuid();
      } else if (typeLogin === 3) {
        user.githubId = faker.string.uuid();
      }

      //fullName
      user.fullName = faker.person.fullName();

      // email
      user.email = faker.internet.email();

      //password
      if (typeLogin === 4)
        user.password = bcrypt.hashSync(faker.internet.password(), 10);

      // phone
      user.phone = faker.phone.number();

      //thumbnail
      user.thumbnail = faker.image.avatar;

      //sex
      const minUnknown = 1;
      const minOther = 1;
      const minFemale = 1;
      const minMale = 1;

      const total = 100;
      const minTotal = minUnknown + minOther + minFemale + minMale;
      const remaining = total - minTotal;

      const otherWeight = minOther + Math.floor(Math.random() * (remaining + 1));
      const femaleWeight = minFemale + Math.floor(Math.random() * (remaining - (otherWeight - minOther) + 1));
      const maleWeight = minMale + (remaining - (otherWeight - minOther) - (femaleWeight - minFemale));
      const unknownWeight = minUnknown; 

      user.sex = faker.helpers.weightedArrayElement([
        { value: 'male', weight: maleWeight },
        { value: 'female', weight: femaleWeight },
        { value: 'other', weight: otherWeight },
        { value: 'unknown', weight: unknownWeight },
      ]);

      // other
      user.status = "active";
      user.deleted = false;

      const [year, month] = yearMonth.split('-');
      const from = `${year}-${month}-01`;
      const to = new Date(year, month, 0); // ngày cuối cùng của tháng
      const toStr = `${year}-${month}-13`;
      user.createdAt = faker.date.between({ from, to: toStr });

      users.push(user);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Error: ", error);
      continue;
    }
  }
  users.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return users;
}