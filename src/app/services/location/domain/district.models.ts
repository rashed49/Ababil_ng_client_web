import { Country } from "./country.models";
import { Division } from "./division.models";

export class District{
    id: number;
    name: string;
    division=new Division();
    country=new Country();
}