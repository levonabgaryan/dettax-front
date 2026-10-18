import { IRecipeCategorizationRepository } from '../ports/repositories/recipe-categorization-repository';

export class CategorizeRecipeUseCase {
  private readonly repo: IRecipeCategorizationRepository;

  constructor(repo: IRecipeCategorizationRepository) {
    this.repo = repo;
  }
  public async execute(dto: CategorizeRecipeDto): Promise<void> {
    await this.repo.createManyAsync(dto);
  }
}

export type CategorizeRecipeDto = Readonly<{
  recipeId: string;
  categoryIds: string[];
}>;
