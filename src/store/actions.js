import axios from 'axios'
import router from '../router'
import * as tipos from './mutationtypes'

export default {
    obterEleicao({commit, state, dispatch}) {
        return new Promise((resolve) => {
            axios.get(`${state.url}/eleicao`)
                .then(response => {
                    resolve(response);
                    commit(tipos.ATUALIZAR_NOME_ELEICAO, response.data.nome);
                    commit(tipos.ATUALIZAR_ETAPA, response.data.etapaAtual);
                    dispatch('inicializarDados')
                })
        })
    },
    obterFila({commit, state}) {
        return new Promise((resolve) => {
            axios.get(`${state.url}/estat-conferencia?etapa=${state.etapa}`)
                .then(response => {
                    resolve(response);
                    commit(tipos.ATUALIZAR_FILA, response.data)
                })
        })
    },
    obterAndamentosZonas({commit, state}) {
        return new Promise((resolve) => {
            axios.get(`${state.url}/andamentos-zonas?etapa=${state.etapa}`)
                .then(response => {
                    resolve(response);
                    commit(tipos.ATUALIZAR_ANDAMENTOS_ZONAS, response.data)
                })
        })
    },
    obterAndamentosPolos({commit, state}) {
        return new Promise((resolve) => {
            axios.get(`${state.url}/andamentos-polos?etapa=${state.etapa}`)
                .then(response => {
                    resolve(response);
                    commit(tipos.ATUALIZAR_ANDAMENTOS_POLOS, response.data)
                })
        })
    },
    obterAndamentosMunicipios({commit, state}) {
        return new Promise((resolve) => {
            axios.get(`${state.url}/andamentos-municipios?etapa=${state.etapa}`)
                .then(response => {
                    resolve(response);
                    commit(tipos.ATUALIZAR_ANDAMENTOS_MUNICIPIOS, response.data)
                })
        })
    },
    obterZonasRest({commit, state}) {
        return new Promise((resolve, reject) => {
            const fake = state.testeAndamentos ? '-fake' : '';
            axios.get(`${state.url}/zonas${fake}?etapa=${state.etapa}`)
                .then(response => {
                    resolve(response.data);
                    commit(tipos.ATUALIZAR_ZONAS, response.data)
                })
                .catch(
                    error => reject(error)
                )
        })
    },
    obterPolosRest({commit, state}) {
        return new Promise((resolve, reject) => {
            const fake = state.testeAndamentos ? '-fake' : '';
            axios.get(`${state.url}/polos${fake}?etapa=${state.etapa}`)
                .then(response => {
                    resolve(response.data);
                    commit(tipos.ATUALIZAR_POLOS, response.data)
                })
                .catch(
                    error => reject(error)
                )
        })
    },
    obterMunicipiosRest({commit, state}) {
        return new Promise((resolve, reject) => {
            const fake = state.testeAndamentos ? '-fake' : '';
            axios.get(`${state.url}/municipios${fake}?etapa=${state.etapa}`)
                .then(response => {
                    resolve(response.data);
                    commit(tipos.ATUALIZAR_MUNICIPIOS, response.data)
                })
                .catch(
                    error => reject(error)
                )
        })
    },
    obterDataAtualizacao({commit, state}) {
        return new Promise((resolve, reject) => {
            axios.get(`${state.url}/etapa?etapa=${state.etapa}`).then(
                response => {
                    resolve(response.data);
                    if (response.data.dataAtualizacao === state.dataUltimaAtualizacao) {
                        commit(tipos.ATUALIZAR_CICLOS, state.ciclos + 1)
                    } else {
                        commit(tipos.ATUALIZAR_CICLOS, 0)
                    }
                    commit(tipos.ATUALIZAR_NOME_ETAPA, response.data.descricao);
                    commit(tipos.ATUALIZAR_DATA_ATUALIZACAO, response.data.dataAtualizacao)
                })
                .catch(
                    error => reject(error)
                )
        })
    },
    inicializarDados({dispatch}) {
        return new Promise((resolve) => {
            dispatch('obterDataAtualizacao');
            dispatch('obterAndamentosZonas');
            dispatch('obterZonasRest');
            dispatch('obterFila');
            dispatch('obterAndamentosPolos');
            dispatch('obterPolosRest');
            dispatch('obterAndamentosMunicipios');
            dispatch('obterMunicipiosRest');
            resolve()
        })
    },
    atualizarEtapaRest({dispatch, commit}, etapa) {
        return new Promise((resolve) => {
            resolve();
            commit(tipos.ATUALIZAR_ETAPA, etapa);
            dispatch('atualizarPolling')
        })
    },
    atualizarPolling({state, dispatch, commit, getters}) {
        commit(tipos.ZERAR_INTERVALOS);
        dispatch('inicializarDados');

        const intData = setInterval(function () {
            dispatch('obterDataAtualizacao')
        }, state.tempoAtualizacao);
        commit(tipos.ATUALIZAR_INT_DATA, intData);

        if (state.visao === tipos.VISAO_FILA) {
            const intFila = setInterval(function () {
                dispatch('obterFila');
                dispatch('obterZonasRest')
            }, state.tempoAtualizacao);
            commit(tipos.ATUALIZAR_INT_FILA, intFila)
        }

        if (state.visao === tipos.VISAO_ZONAS ||
            state.visao === tipos.VISAO_ZONASFILA ||
            state.visao === tipos.VISAO_CONFERENCIA) {
            const intZonas = setInterval(function () {
                dispatch('obterAndamentosZonas');
                dispatch('obterFila');
                dispatch('obterZonasRest')
            }, state.tempoAtualizacao);
            commit(tipos.ATUALIZAR_INT_ZONAS, intZonas)
        }

        if (state.visao === tipos.VISAO_ZONASPOLO) {
            const intZonasPolo = setInterval(function () {
                dispatch('obterZonasRest');
                dispatch('obterAndamentosZonas');
                dispatch('obterPolosRest');
                dispatch('obterAndamentosPolos')
            }, state.tempoAtualizacao);
            commit(tipos.ATUALIZAR_INT_ZONAS_POLOS, intZonasPolo)
        }

        if (state.visao === tipos.VISAO_POLOS) {
            const intPolos = setInterval(function () {
                dispatch('obterAndamentosPolos');
                dispatch('obterPolosRest')
            }, state.tempoAtualizacao);
            commit(tipos.ATUALIZAR_INT_POLOS, intPolos)
        }

        if (state.visao === tipos.VISAO_MUNICIPIOS) {
            const intMunicipios = setInterval(function () {
                dispatch('obterMunicipiosRest')
            }, state.tempoAtualizacao);
            commit(tipos.ATUALIZAR_INT_MUNICIPIOS, intMunicipios)
        }

        if (state.alternarEtapas) {
            const intAlternancia = setInterval(function () {
                const etapa = state.etapa;
                if (etapa === 1 && !getters.getModalExibido) {
                    dispatch('atualizarEtapaRest', 2)
                } else if (etapa === 2 && !getters.getModalExibido) {
                    dispatch('atualizarEtapaRest', 1)
                }
            }, state.tempoAtualizacao * 2);
            commit(tipos.ATUALIZAR_INT_ALTERNANCIA, intAlternancia)
        }

        if (state.modoTelao && state.visao !== tipos.VISAO_CONFIGURACAO) {
            const intTelao = setInterval(function () {
                const visao = state.visao;
                if (visao === tipos.VISAO_ZONAS && !getters.getModalExibido) {
                    router.push({name: tipos.VISAO_POLOS})
                } else if (visao === tipos.VISAO_POLOS && !getters.getModalExibido) {
                    router.push({name: tipos.VISAO_MUNICIPIOS})
                } else if (visao === tipos.VISAO_MUNICIPIOS && !getters.getModalExibido) {
                    router.push({name: tipos.VISAO_ZONAS})
                }
            }, state.tempoAtualizacao * 2);
            commit(tipos.ATUALIZAR_INT_TELAO, intTelao)
        }
    }
}
