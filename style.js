var textConverter,
    textConvertido,
    linhas = [],
    aux01 = 0,
    i,
    ii,
    type,
    modificador,
    name,
    convertido = '',
    isEnum = false,
    enumName,
    enumAux,
    linha,
    modificadoresPermitidos = [
      'public', 
      'private'
    ],
    typesPermitidos = [
      'decimal?',
      'decimal',
      'int?',
      'int',
      'string?',
      'string',
      'DateTime?',
      'DateTime',
      'bool?',
      'bool'
    ];

function converterText() {
  textConverter = document.getElementById("textConverter").value;
  textConvertido = document.getElementById("textConvertido");
  textConvertido.value = '';
  convertido = '';
  linhas = [];
  aux01 = 0;

  //Separa as linhas
  linhas = textConverter.split(/\r?\n|\r/);

  //Percorre as linhas
  for (i=0; i<linhas.length; i++) {
    linha = linhas[i];

    type = '';      
    modificador = '';      
    name = '';
    isEnum = false;
    enumAux = "";

    if (linha.trim() == '') continue;
    
    //Pega modificadores
    for (ii=0; ii<modificadoresPermitidos.length; ii++) {
      if(linha.indexOf(modificadoresPermitidos[ii]) >= 0) {
        linha = linha.replace(modificadoresPermitidos[ii], '');
        modificador = modificadoresPermitidos[ii];
      }
    }

    //Pega type
    for (ii=0; ii<typesPermitidos.length; ii++) {
      if(linha.indexOf(typesPermitidos[ii]) >= 0) {
        linha = linha.replace(typesPermitidos[ii], '');
        type = typesPermitidos[ii];
      }
    }

    //Se for Enum
    if (type == ''){
      type = 'int';
      isEnum = true;
      linha = linha.trim();
      enumName = linha.substring(0, linha.indexOf(" "));
      if (enumName == '') {
        enumName = linha.substring(0, linha.indexOf(";"));
      }
      if (enumName == '') {
        enumName = linha.substring(0, linha.indexOf("{"));
      }
      if (enumName != '') {
        linha = linha.replace(enumName, '')
      }
    }
    if (isEnum) {
      enumAux = ", isEnum: true, enumCls: '" + enumName + "'"
    }

    //Pega name
    linha = linha.trim();
    name = linha.substring(0, linha.indexOf(" "));
    if (name == '') {
      name = linha.substring(0, linha.indexOf(";"));
    }
    if (name == '') {
      name = linha.substring(0, linha.indexOf("{"));
    }

    //Monta linha do model
    convertido += "{ name: '" + name + "', type: '" + converteType(type) + "', fieldLabel: '" + converteFieldLabel(name) + "'" + enumAux + " },\n";
  }

  textConvertido.value = convertido;
  document.getElementById("textConverter").value = '';
};

function converteType (type) {
  switch (type) {
    case 'decimal?':
      return 'float?';
    case 'decimal':
      return 'float';
    case 'DateTime?':
      return 'date?';
    case 'DateTime':
      return 'date';
    case 'bool?':
      return 'boolean?';
    case 'bool':
      return 'boolean';
    default:
      return type;
  }
}

function converteFieldLabel (fieldLAbel) {
  let e,
      letraAux,
      PriLetraAux,
      field = fieldLAbel,
      contCaracter = field.length,
      letrasMaiusculas = "ABCDEFGHYJKLMNOPQRSTUVWXYZ";

  if (field == '') return field;

  field = field.replace(field.charAt(0), field.charAt(0).toLowerCase());
  
  for(e=1; e<contCaracter; e++){
    if (letrasMaiusculas.indexOf(field.charAt(e),0)!=-1){
      letraAux = ' ' + field.charAt(e).toLowerCase();

      field = field.replace(field.charAt(e), letraAux);

      contCaracter++;
    }
  }

  field = field.replace(field.charAt(0), field.charAt(0).toUpperCase());
  return field;
}


