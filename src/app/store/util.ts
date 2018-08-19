//this is a pattern to check no duplicate action key is introduced

let typeCache: {[label:string]:boolean} = {}; //this is keyvalue map of boolean. Map can be used as well

export function type<T>(label:T | ''): T{    
    if(typeCache[<string>label]){
        throw new Error(`The action type "${label}" already exist.`);
    }
    else{
        typeCache[<string>label] =true;
    }
    return <T>label;
}