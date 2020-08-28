export default {
    etapa: 1,
    etapaAtual: 1,
    dataAtualizacao: '',
    visao: '',
    nomeEleicao: '',
    nomeEtapa: '',
    etapaOficial: '',
    visaoRecemAlterada: false,
    ciclos: 0,

    andamentosZonas: [{
        numero: 1,
        descricao: 'Etapa não iniciada',
        detalhamento: 'Data/Hora atual menor que o previsto para o início da etapa pela zona',
        cor: '#95B0B7',
        destacaPendencias: false
    }],

    andamentosPolos: [{
        numero: 1,
        descricao: 'Etapa não iniciada',
        detalhamento: 'Nenhuma zona do polo iniciou a etapa',
        cor: '#95B0B7',
        destacaPendencias: false
    }],

    andamentosMunicipios: [{
        numero: 1,
        descricao: 'Etapa não iniciada',
        detalhamento: 'Nenhuma zona do município iniciou a etapa',
        cor: '#95B0B7'
    }],

    fila: [{
        ordem: 1,
        zona: 1,
        dtAptaConferencia: '',
        tempoEspera: 0,
        conferente: '',
        dtConferenciaIniciada: '',
        dtConferenciaFinalizada: '',
        tempoConferencia: '0'
    }],
    mostrarModalZona: false,
    mostrarModalPolo: false,
    mostrarModalMunicipio: false,
    poloSelecionado: 0,
    url: 'http://lakota:8980/sape/api',
    tempoAtualizacao: 2000,
    intervaloMunicipios: null,
    intervaloZonas: null,
    intervaloPolos: null,
    intervaloZonasPolo: null,
    intervaloDataAtualizacao: null,
    intervaloTelao: null,
    intervaloAlternancia: null,
    intervaloFila: null,
    alternarEtapas: false,
    modoTelao: false,
    ativarNotificacoes: false,

    zonas: {
        1: {
            numero: 1,
            numPolo: 1,
            andamento: 1,
            municipioSede: 'RECIFE',
            situacaoVerificacao: 'ATIVA',
            dataUltimaAtualizacao: '',
            percRealizado: 0,
            itensTotais: 0,
            itensRestantes: 0,
            situacaoConferencia: '',
            dataConferencia: '',
            conferente: '',
            obsConferencia: '',
            situacaoAta: '',
            detAta: '',
            situacaoRelatorios: '',
            detRelatorios: [],
            sts: [],
            pendencias: []
        }
    },
    polos: {
        1: {
            numero: 1,
            andamento: 1,
            municipioSede: 'RECIFE',
            situacaoVerificacao: 'ATIVA',
            dataUltimaAtualizacao: '',
            percRealizado: 0,
            itensTotais: 0,
            itensRestantes: 0,
            sts: [],
            pendencias: []
        }
    },
    municipios: {
        2600054: {
            codIbge: 2600054,
            codTse: 26310,
            nome: 'ABREU E LIMA',
            numPolo: 15,
            situacaoVerificacao: 'ATIVA',
            andamento: 1,
            percRealizado: 0,
            itensTotais: 0,
            itensRestantes: 0,
            dataUltimaAtualizacao: '',
            situacaoRelatorios: 'NA',
            detRelatorios: [],
            sts: []
        }
    },
    testeAndamentos: false,
    contatos: {
        1: {SL: 'Edvan', ramal: '9681'},
        2: {SL: 'Thiago Bandeira Cavalcanti', ramal: 9682},
        3: {SL: 'Marta Regina de Moura Vaz de Oliveira', ramal: 9683},
        4: {SL: 'Jairo Conde Jogaib Júnior', ramal: 9684},
        5: {SL: 'José Inácio Barreiros do Lago', ramal: 9685},
        6: {SL: 'Verônica Alves de Oliveira', ramal: 9686},
        7: {SL: 'Rynan de Lyra Gallindo Filho', ramal: 9687},
        8: {SL: 'Inês Sobral Brito', ramal: 9688},
        9: {SL: 'Marly Maria dos Santos', ramal: 9689},
        10: {SL: 'George Alves da Paixão', ramal: 9690},
        11: {SL: 'José Cacildo de Moura Silva', ramal: 9691},
        12: {SL: 'Gleyce Carmem da Silva', ramal: 9692},
        13: {SL: 'Cicero Alves de Lima Neto', ramal: 9693},
        14: {SL: 'Adriana Oliveira Bezerra de Menezes', ramal: 9694},
        15: {SL: 'Eduardo Araújo Brandão', ramal: 9695},
        16: {SL: 'Marco Antônio de Carvalho Capella', ramal: 9696},
        17: {SL: 'Ricardo Jorge de Morais Costa', ramal: 9697},
        18: {SL: 'Juliana Matos de Brito', ramal: 9698}
    }
}
