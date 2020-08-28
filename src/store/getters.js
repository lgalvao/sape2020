import * as tipos from './mutationtypes'

const moment = require('moment');
moment.locale('pt-BR');

export default {
    getAndamentos: state => {
        switch (state.visao) {
            case tipos.VISAO_RAIZ:
            case tipos.VISAO_ZONAS:
            case tipos.VISAO_ZONASPOLO:
            case tipos.VISAO_ZONASFILA:
            case tipos.VISAO_FILA:
            case tipos.VISAO_CONFERENCIA:
                return state.andamentosZonas;

            case tipos.VISAO_POLOS:
                return state.andamentosPolos;

            case tipos.VISAO_MUNICIPIOS:
                return state.andamentosMunicipios;

            default: {
                console.log('ERRO nos andamentos. Visao: ' + state.visao);
                return state.andamentosZonas
            }
        }
    },
    getCorZona: (state) => (numZona) => {
        if (!state.andamentosZonas) return 'lightgray';
        const zona = state.zonas[numZona];
        if (zona.naoVerificar) return '#eeeeee';

        if (state.andamentosZonas[zona.andamento - 1]) {
            const cor = state.andamentosZonas[zona.andamento - 1].cor;
            if (cor === '#A56A24') {
                return '#d66303'
            }
            return cor
        } else return 'lightgray'
    },
    getZonasArray: (state) => {
        return Object.values(state.zonas)
    },
    getCorPolo: (state) => (numPolo) => {
        if (!state.andamentosPolos) return 'lightgray';
        const andamento = state.polos[numPolo].andamento;
        return state.andamentosPolos[andamento - 1].cor || 'lightgray'
    },
    getCorMunicipio: (state) => (codIbge) => {
        if (!state.andamentosMunicipios) return 'lightgray';
        const andamento = state.municipios[codIbge].andamento;
        return state.andamentosMunicipios[andamento - 1].cor || 'lightgray'
    },
    getDescAndamento: (state, getters) => (andamento) => {
        const andamentos = getters.getAndamentos;
        if (andamentos[andamento - 1]) {
            return andamentos[andamento - 1].descricao || ''
        } else return ''
    },
    getModalExibido: (state) => {
        return (state.mostrarModalZona || state.mostrarModalMunicipio || state.mostrarModalPolo)
    },
    getAndamentosPendenciasPolos: (state) => {
        const retorno = [];
        for (const polo in state.polos) {
            retorno[polo] = state.etapa + (state.polos[polo].andamento) * 10
                + (state.polos[polo].pendencias.length) * 100
        }
        return JSON.stringify(retorno)
    },
    getAndamentosEtapaMunicipios: (state) => {
        const retorno = [];
        for (const municipio in state.municipios) {
            retorno[municipio] = state.etapa + (state.municipios[municipio].andamento) * 10
        }
        return JSON.stringify(retorno)
    },
    getUltimaAtualizacao: (state) => {
        return moment(state.dataUltimaAtualizacao, 'DD/MM/YYYY HH:mm:ss')
    }
}