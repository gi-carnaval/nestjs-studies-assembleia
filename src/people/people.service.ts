import { Injectable } from '@nestjs/common';
import { Person } from './person';

@Injectable()
export class PeopleService {
  people: Person[] = [];

  list(): Person[] {
    return this.people;
  }

  getById(id: number): Person {
    const foundPerson = this.people.find((person) => person.id == id);

    return foundPerson;
  }

  savePerson({ name }: { name: string }): void {
    const newId = this.people.at(0)
      ? this.people.at(this.people.length - 1).id + 1
      : 1;
    const person = {
      id: newId,
      name: name,
    };
    this.people.push(person);
  }

  updatePerson({ name }: { name: string }, id: number): void {
    this.people.forEach((person) => {
      if (id == person.id) {
        person.name = name;
      }
    });
  }

  deletePerson(id: number) {
    const newList = this.people.filter((person) => id !== person.id);
    this.people = newList;
  }
}
