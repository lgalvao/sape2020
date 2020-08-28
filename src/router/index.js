import Vue from 'vue'
import VueRouter from 'vue-router'
import * as tipos from '../store/mutationtypes'

Vue.use(VueRouter);
const VisaoZonas = () => import('../views/VisaoZonas.vue');
const VisaoZonasPolo = () => import('../views/VisaoZonasPolo.vue');
const VisaoPolos = () => import('../views/VisaoPolos.vue');
const VisaoMunicipios = () => import('../views/VisaoMunicipios.vue');
const VisaoConferencia = () => import('../views/VisaoConferencia');
const VisaoZonasFila = () => import('../views/VisaoZonasFila.vue');
const VisaoZonas2 = () => import('../novos/VisaoZonas2');
const Configuracao = () => import('../views/VisaoConfiguracao.vue');

const router = new VueRouter({
    routes: [
        {path: '/', name: tipos.VISAO_RAIZ, redirect: {name: tipos.VISAO_ZONAS}},
        {path: '/zonas', name: tipos.VISAO_ZONAS, component: VisaoZonas},
        {path: '/polos', name: tipos.VISAO_POLOS, component: VisaoPolos},
        {path: '/municipios', name: tipos.VISAO_MUNICIPIOS, component: VisaoMunicipios},
        {path: '/configuracao', name: tipos.VISAO_CONFIGURACAO, component: Configuracao},
        {path: '/zonaspolo', name: tipos.VISAO_ZONASPOLO, component: VisaoZonasPolo},
        {path: '/zonasfila', name: tipos.VISAO_ZONASFILA, component: VisaoZonasFila},
        {path: '/conferencia', name: tipos.VISAO_CONFERENCIA, component: VisaoConferencia},
        {path: '/novo', name: 'NOVO', component: VisaoZonas2}
    ]
});

export default router
