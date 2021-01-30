class ObjLoader {
	private static removeComent(str: string) {
		var index = str.indexOf("#");
		if (index > -1) {
			return str.substring(0, index);
		} else {
			return str;
		}
	}
	private model:Model = new Model;
	private parsePoint(line_items: string[]) {
		const x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
		const y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
		const z = line_items.length >= 4 ? parseFloat(line_items[3]) : 0.0;
		this.model.point_coords.push(new Vector3(x,y,z))
	}
	private parseNormal(line_items: string[]) {
		const x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
		const y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
		const z = line_items.length >= 4 ? parseFloat(line_items[3]) : 0.0;
		this.model.normals.push(new Vector3(x,y,z))
	}
	private parseTexture(line_items: string[]) {
		const x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
		const y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
		this.model.texture_coords.push(new Vector2(x,y))
	}
	private parseMesh(line_items: string[]){
		const v_len=line_items.length-1;
		let v=[]
		for(let i=1;i<=v_len;++i){
			const v_infos=line_items[i].split("/");
			var a=parseInt(v_infos[0]);
			var b=parseInt(v_infos[1]);
			var c=parseInt(v_infos[2]);
			v.push(new Vertex(this.model.point_coords[a-1],this.model.normals[c-1],this.model.texture_coords[b-1]));
		}
		this.model.meshes_group.push(new Triangle(v[0],v[1],v[2]))
	}
	loadModel(obj: String) {
		let lines: string[] = obj.split('\n')
		let len = lines.length;
		for (let i = 0; i < len; ++i) {
			let line = ObjLoader.removeComent(lines[i]);
			let line_items = line.replace(/\s\s+/g, ' ').trim().split(' ');
			switch (line_items[0].toLowerCase()) {
				case "v":
					this.parsePoint(line_items);
					break;
				case "vn":
					this.parseNormal(line_items);
					break;
				case "vt":
					this.parseTexture(line_items);
					break;
				case "f":
					this.parseMesh(line_items);
					break;
				default:
					break;
			}
		}
	}
	getModel(){
		return this.model;
	}
}

