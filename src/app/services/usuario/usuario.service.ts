import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  usuario: Usuario;
  token = '';

  constructor(public http: HttpClient, public router: Router) {
    this.cargarStorage();
   }

  estaLogeado() {
    return (this.token.length > 5) ? true : false;
  }

  logout(){
    this.token = '';
    this.usuario = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
  
  cargarStorage() {
    if(localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  loginGoogle(token: string) {
    let url = `${URL_SERVICIOS}/login/google`;
    
    return this.http.post(url, { token }).pipe(
      map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario);

        return true;
      })
    );
  }

  login(usuario: Usuario, recuerdame = false) {
    if(recuerdame) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = `${URL_SERVICIOS}/login`;

    return this.http.post(url, usuario).pipe(
      map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario);
        
        return true;
      })
    );
  }

  crearUsuario(usuario: Usuario) {
    let url = `${URL_SERVICIOS}/usuario`;

    return this.http.post(url, usuario)
      .pipe(map( (res: any) => {
        alert('Usuario creado exitosamente ' + usuario.email);
        return res.usuario;
      }));
  }

  actualizarUsuario(usuario: Usuario) {
    let url = `${URL_SERVICIOS}/usuario/${usuario._id}`;
    url += '?token=' + this.token;
    
    return this.http.put(url, usuario)
      .pipe(map((res: any) => {
        this.guardarStorage(res.usuario._id, this.token, res.usuario);
          alert('Usuario actualizado exitosamente ' + usuario.nombre);
          return true;
      }))
  }
}
