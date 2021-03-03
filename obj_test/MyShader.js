class MyShader {
    shade(info) {
        var texture=info.texture;
        var tex_coord=info.tex_coord;
        var tex_color=texture.getColor(tex_coord.x(),tex_coord.y());
        return tex_color
    }
}