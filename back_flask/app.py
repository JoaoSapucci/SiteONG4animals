from flask import Flask, request, jsonify, Response
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


def identificarTipoImagem(foto):
    if foto.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"

    if foto.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"

    if foto.startswith((b"GIF87a", b"GIF89a")):
        return "image/gif"

    if foto[:4] == b"RIFF" and foto[8:12] == b"WEBP":
        return "image/webp"

    return None


@app.route("/animais/<int:idAnimal>/foto", methods=["POST"])
def receberFoto(idAnimal):
    arquivo = request.files.get("foto")

    if arquivo is None or arquivo.filename == "":
        return jsonify({
            "erro": "Nenhuma foto foi enviada"
        }), 400

    foto = arquivo.read()

    if len(foto) > 5 * 1024 * 1024:
        return jsonify({
            "erro": "A foto deve ter no máximo 5 MB"
        }), 413

    if identificarTipoImagem(foto) is None:
        return jsonify({
            "erro": "Formato de imagem inválido"
        }), 400

    if not cadastrarFoto(idAnimal, foto):
        return jsonify({
            "erro": "Animal não encontrado"
        }), 404

    return jsonify({
        "mensagem": "Foto cadastrada com sucesso!"
    }), 200


@app.route("/animais/<int:idAnimal>/foto", methods=["GET"])
def exibirFoto(idAnimal):
    foto = consultarFoto(idAnimal)

    if foto is None:
        return jsonify({
            "erro": "Foto não encontrada"
        }), 404

    tipo = identificarTipoImagem(foto)

    if tipo is None:
        return jsonify({
            "erro": "Formato de imagem não reconhecido"
        }), 415

    return Response(foto, mimetype=tipo)


@app.route("/animais/<int:idAnimal>", methods=["DELETE"])
def excluir(idAnimal):

    if not excluirAnimal(idAnimal):
        return jsonify({
            "erro": "Animal não encontrado"
        }), 404

    return jsonify({
        "mensagem": "Animal excluído com sucesso!"
    }), 200


if __name__ == "__main__":
    app.run(debug=True)