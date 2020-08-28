import * as tipos from './mutationtypes'

export default {
    [tipos.ATUALIZAR_ETAPA](state, valor) {
        state.etapa = valor
    },
    [tipos.ATUALIZAR_NOME_ETAPA](state, valor) {
        state.nomeEtapa = valor
    },
    [tipos.ATUALIZAR_ETAPA_OFICIAL](state, valor) {
        state.etapaOficial = valor
    },
    [tipos.ATUALIZAR_VISAO](state, valor) {
        state.visao = valor
    },
    [tipos.ATUALIZAR_NOME_ELEICAO](state, valor) {
        state.nomeEleicao = valor
    },
    [tipos.ATUALIZAR_ZONAS](state, valor) {
        state.zonas = valor
    },
    [tipos.ATUALIZAR_POLOS](state, valor) {
        state.polos = valor
    },
    [tipos.ATUALIZAR_MUNICIPIOS](state, valor) {
        state.municipios = valor
    },
    [tipos.ATUALIZAR_ANDAMENTOS_ZONAS](state, valor) {
        state.andamentosZonas = valor
    },
    [tipos.ATUALIZAR_ANDAMENTOS_POLOS](state, valor) {
        state.andamentosPolos = valor
    },
    [tipos.ATUALIZAR_ANDAMENTOS_MUNICIPIOS](state, valor) {
        state.andamentosMunicipios = valor
    },
    [tipos.ATUALIZAR_FILA](state, valor) {
        state.fila = valor
    },
    [tipos.MOSTRAR_MODAL_POLO](state, valor) {
        state.mostrarModalPolo = valor
    },
    [tipos.MOSTRAR_MODAL_MUNICIPIO](state, valor) {
        state.mostrarModalMunicipio = valor
    },
    [tipos.MOSTRAR_MODAL_ZONA](state, mostrar) {
        state.mostrarModalZona = mostrar
    },
    [tipos.ATUALIZAR_DATA_ATUALIZACAO](state, data) {
        state.dataUltimaAtualizacao = data
    },
    [tipos.ATUALIZAR_URL](state, url) {
        state.url = url
    },
    [tipos.ATUALIZAR_POLO_SELECIONADO](state, valor) {
        state.poloSelecionado = valor
    },
    [tipos.ATUALIZAR_ALTERNAR_ETAPAS](state, valor) {
        state.alternarEtapas = valor
    },
    [tipos.ATUALIZAR_MODO_TELAO](state, valor) {
        state.modoTelao = valor
    },
    [tipos.ATIVAR_NOTIFICACOES](state, valor) {
        state.ativarNotificacoes = valor
    },
    [tipos.ZERAR_INTERVALOS](state) {
        clearInterval(state.intervaloMunicipios);
        clearInterval(state.intervaloZonas);
        clearInterval(state.intervaloPolos);
        clearInterval(state.intervaloAlternancia);
        clearInterval(state.intervaloTelao);
        clearInterval(state.intervaloDataAtualizacao);
        clearInterval(state.intervaloZonasPolo);
        clearInterval(state.intervaloFila);

        state.intervaloMunicipios = null;
        state.intervaloZonas = null;
        state.intervaloPolos = null;
        state.intervaloAlternancia = null;
        state.intervaloTelao = null;
        state.intervaloDataAtualizacao = null;
        state.intervaloZonasPolo = null;
        state.intervaloFila = null
    },
    [tipos.ATUALIZAR_INT_DATA](state, valor) {
        state.intervaloDataAtualizacao = valor
    },
    [tipos.ATUALIZAR_INT_TELAO](state, valor) {
        state.intervaloTelao = valor
    },
    [tipos.ATUALIZAR_INT_POLOS](state, valor) {
        state.intervaloPolos = valor
    },
    [tipos.ATUALIZAR_INT_ZONAS](state, valor) {
        state.intervaloZonas = valor
    },
    [tipos.ATUALIZAR_INT_ZONAS_POLOS](state, valor) {
        state.intervaloZonasPolo = valor
    },
    [tipos.ATUALIZAR_INT_MUNICIPIOS](state, valor) {
        state.intervaloMunicipios = valor
    },
    [tipos.ATUALIZAR_INT_ALTERNANCIA](state, valor) {
        state.intervaloAlternancia = valor
    },
    [tipos.ATUALIZAR_INT_FILA](state, valor) {
        state.intervaloFila = valor
    },
    [tipos.ATUALIZAR_TESTE_ANDAMENTOS](state, valor) {
        state.testeAndamentos = valor
    },
    [tipos.ATUALIZAR_VISAO_RECEM_ALTERADA](state, valor) {
        state.visaoRecemAlterada = valor
    },
    [tipos.ATUALIZAR_CICLOS](state, valor) {
        state.ciclos = valor
    }

}
