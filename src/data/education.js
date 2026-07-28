export const educationData = [
  {
    id: 'artes-visuales',
    degree: 'Tecnólogo Superior en Diseño Gráfico y Multimedia',
    institution: 'Instituto Superior Tecnológico de Artes Visuales',
    location: 'Quito — Ecuador',
    period: '',
    isFinished: true,
  },
  /* El badge lleva la duración, no un estado.
     Decía "En pausa", que deja el asunto sin cerrar e invita justo a la
     pregunta de por qué se dejó. Con el tecnólogo ya titulado arriba, esta
     formación se lee como estudio adicional y no como una carrera fallida:
     el dato de los dos años y medio informa, y la nota dice sin rodeos que
     no hubo titulación. */
  {
    id: 'cordillera',
    degree: 'Formación en Diseño Gráfico',
    institution: 'Instituto Superior Tecnológico Cordillera',
    location: '',
    period: '',
    isFinished: false,
    badge: '2 años y medio',
    note: 'Formación cursada, sin titulación.',
  },
];
