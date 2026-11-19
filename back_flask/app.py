from flask import Flask, request, jsonify
from flask_cors import CORS
from modulos import *

app = Flask(__name__)
CORS(app)

@app.route("/animais", methods=["GET"])
def carregarAnimais():
    animais = consultarAnimais()

    return jsonify(animais)


@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    dados = request.get_json()

    idAnimal = cadastrarAnimal(dados)

    return jsonify({
        "mensagem": "Animal cadastrado com sucesso!",
        "id": idAnimal
    }), 201

if __name__ == "__main__":
    app.run(debug=True)