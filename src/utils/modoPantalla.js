'use strict'

// domotek: decide si la interfaz se muestra en modo táctil (pantalla de la
// impresora, 800×480) o en modo escritorio (ordenador).
//
// - Por defecto: escritorio si la ventana mide 1200 px o más de ancho.
// - Se puede forzar con ?modo=tactil o ?modo=escritorio en la URL; la
//   elección se guarda en este navegador. ?modo=auto vuelve al automático.

import Vue from 'vue'

const CLAVE = 'domobio.modoPantalla';
const ANCHO_ESCRITORIO = 1200;

function leerForzado() {
	try {
		const q = new URLSearchParams(window.location.search).get('modo');
		if (q === 'tactil' || q === 'escritorio') {
			localStorage.setItem(CLAVE, q);
			return q;
		}
		if (q === 'auto') {
			localStorage.removeItem(CLAVE);
			return null;
		}
		const guardado = localStorage.getItem(CLAVE);
		return (guardado === 'tactil' || guardado === 'escritorio') ? guardado : null;
	} catch (e) {
		return null;
	}
}

const estado = Vue.observable({
	ancho: window.innerWidth,
	forzado: leerForzado()
});

window.addEventListener('resize', () => { estado.ancho = window.innerWidth; });

export function esEscritorio() {
	if (estado.forzado) {
		return estado.forzado === 'escritorio';
	}
	return estado.ancho >= ANCHO_ESCRITORIO;
}

export function forzarModo(modo) {
	estado.forzado = (modo === 'tactil' || modo === 'escritorio') ? modo : null;
	try {
		if (estado.forzado) { localStorage.setItem(CLAVE, estado.forzado); } else { localStorage.removeItem(CLAVE); }
	} catch (e) { /* sin almacenamiento local */ }
}

export function modoForzado() {
	return estado.forzado;
}

// true si la ventana es lo bastante ancha para el modo escritorio (aunque se haya forzado el táctil)
export function ventanaAncha() {
	return estado.ancho >= ANCHO_ESCRITORIO;
}
