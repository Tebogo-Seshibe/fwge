function print(...message: string[]):void
{
    console.log(message.join(" "));
}

interface Human
{
    /**
     * @description Prints hello
     */
    greet(): void
}

class Person implements Human
{
    public name: string;  
    public surname: string;

    constructor(name: string, surname: string)
    {
        this.name = name;
        this.surname = surname;
    }

    greet()
    {
        print("Hello. My name is", this.name, this.surname);
    }
}

class Student extends Person
{
    public course: string;
    public year: number;

    constructor(name: string, surname: string, course?: string, year?: number)
    {
        super(name, surname);
    }
}