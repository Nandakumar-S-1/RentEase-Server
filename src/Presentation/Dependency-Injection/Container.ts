//Dependency Injection is a design pattern where a class receives
//its dependencies from outside rather than creating them itself.

// import { container } from 'tsyringe';
import { RepositoryModule } from './RepositoryModule';
import { ServiceModule } from './ServiceModule';
import { UseCaseModule } from './UseCaseModule';

export class Container_Setup {
    static registerAll(): void {
        RepositoryModule.registerModules();
        UseCaseModule.registerModules();
        ServiceModule.registerModules();
    }
}
//App starts
Container_Setup.registerAll();

//here is where the DI happens .
// the higher lev module like usecaxes depnds on abstraction rather than class implemntetion
//so insted of hardcoding the iuser repo is injected to usecase

//when ever something asks for UserRepository it will give am instance of UserRepository class

//This is the root of the application, which menas the place where teh wire connections of dependenices happen.
// like if i wanna change from postgres to mongo i can create mongo user repo and change it here in useclass to that mongouser repo.
