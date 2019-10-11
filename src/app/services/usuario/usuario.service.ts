import { Injectable } from "@angular/core";
import { Usuario } from "../../models/usuario.model";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/config";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { SubirArchivoService } from "../subir-archivo/subir-archivo.service";
import swal from "sweetalert";

@Injectable({
  providedIn: "root"
})
export class UsuarioService {
  usuario: Usuario;
  token = "";
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivo: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogeado() {
    return this.token.length > 5 ? true : false;
  }

  logout() {
    this.token = "";
    this.usuario = null;
    this.menu = [];

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("menu");
    this.router.navigate(["/login"]);
  }

  cargarStorage() {
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.menu = JSON.parse(localStorage.getItem("menu"));
    } else {
      this.token = "";
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem("menu",  JSON.stringify(menu));
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  loginGoogle(token: string) {
    let url = `${URL_SERVICIOS}/login/google`;

    return this.http.post(url, { token }).pipe(
      map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario, res.menu);
        return true;
      })
    );
  }

  login(usuario: Usuario, recuerdame = false) {
    if (recuerdame) {
      localStorage.setItem("email", usuario.email);
    } else {
      localStorage.removeItem("email");
    }

    let url = `${URL_SERVICIOS}/login`;

    return this.http.post(url, usuario).pipe(
      map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario, res.menu);
        return true;
      })
    );
  }

  crearUsuario(usuario: Usuario) {
    let url = `${URL_SERVICIOS}/usuario`;

    return this.http.post(url, usuario).pipe(
      map((res: any) => {
        swal("Usuario creado exitósamente", usuario.email, "success");
        return res.usuario;
      })
    );
  }

  actualizarUsuario(usuario: Usuario) {
    let url = `${URL_SERVICIOS}/usuario/${usuario._id}`;
    url += "?token=" + this.token;

    return this.http.put(url, usuario).pipe(
      map((res: any) => {
        if (usuario._id === this.usuario._id) {
          let usuarioDB: Usuario = res.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }
        swal("Usuario actualizado exitósamente", usuario.nombre, "success");

        return true;
      })
    );
  }

  actualizarImagen(archivo: File, id: string) {
    this._subirArchivo
      .subirArchivo(archivo, "usuarios", id)
      .then((res: any) => {
        this.usuario.img = res.elementoActualizado.img;
        swal("Imagen Atualizada Exitósamente!");
        this.guardarStorage(id, this.token, this.usuario, this.menu);
      })
      .catch(res => {
        console.log("catch", res);
      });
  }

  cargarUsuarios(desde: number = 0) {
    let url = `${URL_SERVICIOS}/usuario?desde=${desde}`;

    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    let url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}`;

    return this.http.get(url).pipe(map((res: any) => res.usuarios));
  }

  eliminarUsuario(id: string) {
    let url = `${URL_SERVICIOS}/usuario/${id}`;
    url += "?token=" + this.token;

    return this.http.delete(url).pipe(
      map(res => {
        swal(
          "Usuario eliminado",
          "El usuario ha sido eliminado exitósamente.",
          "success"
        );
        return true;
      })
    );
  }
}
