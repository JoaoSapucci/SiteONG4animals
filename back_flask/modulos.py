import sqlite3
import os

CAMINHO_BANCO = os.path.join(
    os.path.dirname(__file__),
    "PatasElar.db"
)

def consultarAnimais():
    conexao = sqlite3.connect(CAMINHO_BANCO)
    conexao.row_factory = sqlite3.Row

    cursor = conexao.cursor()
    cursor.execute("SELECT * FROM animais")

    registros = cursor.fetchall()
    animais = []

    for registro in registros:
        animal = dict(registro)
        animal.pop("foto", None)
        animais.append(animal)

    conexao.close()

    return animais

def cadastrarAnimal(dados):
    conexao = sqlite3.connect(CAMINHO_BANCO)
    cursor = conexao.cursor()

    cursor.execute("""
    INSERT INTO animais (
        nome, especie, sexo, idade, caracteristicas,
        porte, protetor, contato, data, local
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    dados["nome"],
    dados["especie"],
    dados["sexo"],
    dados["idade"],
    dados["caracteristicas"],
    dados["porte"],
    dados["protetor"],
    dados["contato"],
    dados["data"],
    dados["local"]
))

    idAnimal = cursor.lastrowid

    conexao.commit()
    conexao.close()

    return idAnimal


def cadastrarFoto(idAnimal, foto):
    conexao = sqlite3.connect(CAMINHO_BANCO)
    cursor = conexao.cursor()

    cursor.execute("""
        UPDATE animais
        SET foto = ?
        WHERE id = ?
    """, (foto, idAnimal))

    atualizado = cursor.rowcount > 0

    conexao.commit()
    conexao.close()

    return atualizado


def consultarFoto(idAnimal):
    conexao = sqlite3.connect(CAMINHO_BANCO)
    cursor = conexao.cursor()

    cursor.execute(
        "SELECT foto FROM animais WHERE id = ?",
        (idAnimal,)
    )

    registro = cursor.fetchone()

    conexao.close()

    if registro is None:
        return None

    return registro[0]

def excluirAnimal(idAnimal):
    conexao = sqlite3.connect(CAMINHO_BANCO)
    cursor = conexao.cursor()

    cursor.execute("""
        DELETE FROM animais
        WHERE id = ?
    """, (idAnimal,))

    excluido = cursor.rowcount > 0

    conexao.commit()
    conexao.close()

    return excluido
