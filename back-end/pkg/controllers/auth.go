package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"

	"github.com/angshumanHalder/potential-pancake/pkg/config"
	"github.com/angshumanHalder/potential-pancake/pkg/services"
	"github.com/angshumanHalder/potential-pancake/pkg/utils"
)

const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

type LoginRequest struct {
	Code  string
	Scope []string
}

func Login(db *mongo.Database) http.Handler {
	var googleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:3000",
		ClientID:     config.Config.Client.Id,
		ClientSecret: config.Config.Client.Secret,
		Scopes:       []string{},
		Endpoint:     google.Endpoint,
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Login Handler")
		if r.Method != "POST" {
			return
		}
		body := LoginRequest{}
		utils.FromJSON(r.Body, &body)
		googleOauthConfig.Scopes = append(googleOauthConfig.Scopes, body.Scope...)
		token, err := googleOauthConfig.Exchange(context.Background(), body.Code)
		if err != nil {
			utils.ReturnErr(&w, fmt.Errorf("code exchange error %s", err), 400)
			return
		}
		userInfo, err := http.Get(oauthGoogleUrlAPI + token.AccessToken)
		if err != nil {
			utils.ReturnErr(&w, fmt.Errorf("fetch userinfo error %s", err), 404)
			return
		}
		defer userInfo.Body.Close()

		utils.ReturnJSON(&w, func() (interface{}, error) {
			body, err := io.ReadAll(userInfo.Body)
			if err != nil {
				return nil, err
			}
			var googleUser services.GoogleUser
			if err = json.Unmarshal(body, &googleUser); err != nil {
				log.Println("unmarshal", err)
				return nil, err
			}
			if err = services.InsertUser(db, googleUser, token.AccessToken, token.RefreshToken); err != nil {
				log.Println("insert user", err)
				return nil, err
			}
			jwtToken, err := utils.IssueJWTToken(googleUser.Email)
			if err != nil {
				return nil, err
			}
			return struct {
				Picture   string
				GivenName string
				Token     string
			}{
				Picture:   googleUser.Picture,
				GivenName: googleUser.GivenName,
				Token:     jwtToken,
			}, nil
		})
	})
}

func Logout(db *mongo.Database) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Logout Handler")
		if r.Method != "GET" {
			return
		}
		utils.ReturnJSON(&w, func() (interface{}, error) {
			token := utils.ExtractToken(r)
			if err := services.InsertInvalidToken(db, token); err != nil {
				return nil, err
			}
			return nil, nil
		})
	})
}
