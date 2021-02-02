class Material{
    private data_:Color[][];
    private name_:string
    constructor(img_data:Color[][],name:string){
        this.data_=img_data
        this.name_=name;
    }
    get name(){
        return this.name_
    }
    getColor(x:number,y:number){
        return this.data_[x][y]
    }
}