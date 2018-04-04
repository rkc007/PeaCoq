FROM haskell:latest
RUN cabal update
RUN apt-get update
RUN apt-get install -y git-core wget unzip pkg-config coq ocaml ocaml-base ocaml-core ocaml-batteries-included opam ocaml-tools
RUN git clone https://github.com/creatorrr/PeaCoq.git
WORKDIR PeaCoq
RUN ./setup.sh
RUN cabal install
CMD peacoq -p $PORT
