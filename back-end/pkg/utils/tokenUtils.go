package utils

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/angshumanHalder/potential-pancake/pkg/config"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ErrInvalidToken = errors.New("token is invalid")
	ErrExpiredToken = errors.New("token has expired")
)

func IssueJWTToken(email string) (string, error) {
	var err error
	secret := config.Config.Token.Secret
	atClaims := jwt.MapClaims{}

	atClaims["email"] = email
	atClaims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}
	return token, nil
}

func TokenValid(db *mongo.Database, r *http.Request) (jwt.MapClaims, error) {
	token, err := VerifyToken(db, r)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok && !token.Valid {
		return nil, ErrInvalidToken
	}
	return claims, nil
}

func VerifyToken(db *mongo.Database, r *http.Request) (*jwt.Token, error) {
	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.Config.Token.Secret), nil
	})
	if err != nil {
		verr, ok := err.(*jwt.ValidationError)
		if ok && errors.Is(verr.Inner, errors.New("token has expired")) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}
	invalidToken := db.Collection("invalid_tokens").FindOne(context.Background(), bson.M{"token": token})
	if invalidToken.Err() != nil {
		if invalidToken.Err().Error() == mongo.ErrNoDocuments.Error() {
			return token, nil
		}
		return nil, ErrInvalidToken
	}
	return token, nil
}

func ExtractToken(r *http.Request) string {
	keys := r.URL.Query()
	token := keys.Get("token")
	if token != "" {
		return token
	}
	bearToken := r.Header.Get("Authorization")
	strArr := strings.Split(bearToken, " ")
	if len(strArr) == 2 {
		return strArr[1]
	}
	return ""
}
