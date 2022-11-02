import { EntityRepository, Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { SignupDto } from './dto';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signupDto: SignupDto) {
    const { password } = signupDto;

    const user = new User();
    user.username = signupDto.username;
    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }
}
