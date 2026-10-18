import { IRecipeCategorizationRepository } from '../ports/repositories/recipe-categorization-repository';

export class CategorizeRecipeUseCase {
  private readonly repo: IRecipeCategorizationRepository;

  constructor(repo: IRecipeCategorizationRepository) {
    this.repo = repo;
  }
  public async execute(dto: UncategorizeRecipeDTO): Promise<void> {
    await this.repo.deleteManyByRecipeCategoryUuids(dto.recipeId, dto.categoryIds);
  }
}

export type UncategorizeRecipeDTO = Readonly<{
  recipeId: string;
  categoryIds: string[];
}>;
