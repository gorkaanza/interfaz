'use strict'

// domotek: modo claro / modo oscuro del tema domoBIO.
//
// La elección se guarda en este navegador (la pantalla de la impresora y el
// ordenador pueden ir cada uno en su modo). La hoja de estilos usa variables
// CSS (--bio-*) que cambian con la clase .bio-claro; aquí están los mismos
// colores para lo que se pinta con JavaScript (lienzos y gráficos SVG).
// Si cambias un color, cámbialo también en src/scss/tema-bio.scss.

import Vue from 'vue'

const CLAVE = 'domobio.modoColor';

function leer() {
	try {
		return localStorage.getItem(CLAVE) === 'claro';
	} catch (e) {
		return false;
	}
}

const estado = Vue.observable({ claro: leer() });

export function esClaro() {
	return estado.claro;
}

export function fijarClaro(claro) {
	estado.claro = !!claro;
	try {
		localStorage.setItem(CLAVE, claro ? 'claro' : 'oscuro');
	} catch (e) {
		// sin almacenamiento: el modo dura hasta recargar
	}
}

const OSCURO = {
	fondo: '#14171A', sup: '#1E2328', sup2: '#262C33', linea: '#2A3138', linea2: '#3A444D', texto: '#E8EDF1', tenue: '#9AA5AF', apagado: '#5A6670', hondo: '#14171A',
	acento: '#3CC9B0', acentoBg: '#1F3B37', acentoRgb: '60,201,176', calor: '#F2A65A', azul: '#6CB8E6', lila: '#B49CF2', lilaBg: '#2B2540', lilaRgb: '180,156,242',
	amarillo: '#F2D35A', verde: '#6EDDA9', verdeRgb: '110,221,169', peligro: '#F08A83', zona: 'rgba(255,255,255,0.06)'
};

// Blancos y grises muy claros con el azul (#0A21AD) y el amarillo (#FFB812) del logo
const CLARO = {
	fondo: '#F3F5F8', sup: '#FFFFFF', sup2: '#EEF1F5', linea: '#E4E8EE', linea2: '#C9D0DA', texto: '#141A29', tenue: '#5D6878', apagado: '#98A2AE', hondo: '#F6F8FB',
	acento: '#0A21AD', acentoBg: '#E3E7FA', acentoRgb: '10,33,173', calor: '#B87400', azul: '#1F6FB8', lila: '#6A4CC9', lilaBg: '#EEEAFB', lilaRgb: '106,76,201',
	amarillo: '#B58300', verde: '#16865A', verdeRgb: '22,134,90', peligro: '#C62828', zona: 'rgba(20,26,41,0.05)'
};

export function paletaBio() {
	return estado.claro ? CLARO : OSCURO;
}
