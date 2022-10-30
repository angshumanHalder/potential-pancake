package utils

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func SetJSONHeader(w *http.ResponseWriter) {
	(*w).Header().Set("content-type", "application/json; charset=utf-8")
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func ReturnJSON[T any](w *http.ResponseWriter, withData func() (T, error)) {
	SetJSONHeader(w)

	data, err := withData()
	if err != nil {
		(*w).WriteHeader(500)
		errJSON, marshaErr := json.Marshal(&err)
		if marshaErr != nil {
			log.Println(marshaErr)
			return
		}
		(*w).Write(errJSON)
		return
	}

	jsonData, err := json.Marshal(&data)
	if err != nil {
		log.Println(err)
		(*w).WriteHeader(500)
		return
	}
	(*w).Write(jsonData)
}

func FromJSON[T any](body io.Reader, target T) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(body)
	json.Unmarshal(buf.Bytes(), &target)
}

func ReturnErr(w *http.ResponseWriter, err error, code int) {
	ReturnJSON(w, func() (interface{}, error) {
		errorMessage := struct {
			Err string
		}{
			Err: err.Error(),
		}
		(*w).WriteHeader(code)
		return errorMessage, nil
	})
}
