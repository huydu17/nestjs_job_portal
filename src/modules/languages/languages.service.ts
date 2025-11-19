import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto) {
    const { name } = createLanguageDto;
    const languageExist = await this.languageRepository.findOne({
      where: { name },
    });
    if (languageExist) {
      throw new BadRequestException('Language already exists');
    }
    const language = new Language();
    Object.assign(language, createLanguageDto);
    return this.languageRepository.save(language);
  }

  findAll() {
    return this.languageRepository.find();
  }

  async findOne(languageId: number) {
    const language = await this.languageRepository.findOne({
      where: { id: languageId },
    });
    if (!language) {
      throw new NotFoundException('Language not found');
    }
    return language;
  }

  async update(languageId: number, updateLanguageDto: UpdateLanguageDto) {
    const language = await this.findOne(languageId);
    Object.assign(language, updateLanguageDto);
    return this.languageRepository.save(language);
  }

  async remove(languageId: number) {
    await this.findOne(languageId);
    await this.languageRepository.delete(languageId);
  }
}
