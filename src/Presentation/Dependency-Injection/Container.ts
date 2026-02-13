//Dependency Injection is a design pattern where a class receives
//its dependencies from outside rather than creating them itself.

// import { container } from 'tsyringe';
import { RepositoryModule } from './RepositoryModule';
import { UseCaseModule } from './UseCaseModule';

export class Container_Setup {
  static registerAll(): void {
    RepositoryModule.registerModules();
    UseCaseModule.registerModules();
  }
}
Container_Setup.registerAll();

//here is where the DI happens .
//when ever something asks for UserRepository it will give am instance of UserRepository class

//This is the root of the application, which menas the place where teh wire connections of dependenices happen.
// like if i wanna change from postgres to mongo i can create mongo user repo and change it here in useclass to that mongouser repo.
