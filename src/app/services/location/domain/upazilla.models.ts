import { District } from "./district.models";
import { Division } from "./division.models";
import { Country } from "./country.models";

export class Upazilla {
    id: number;
    name: string;
    district = new District();
    division = new Division();
    country = new Country();
}