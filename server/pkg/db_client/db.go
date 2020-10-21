package db_client

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

type DBService struct {
	DBClient *mongo.Client
	timeout  int
}

func NewDBService() *DBService {
	timeout := 15
	var err error
	dbClient, err := mongo.NewClient(
	// options.Client().ApplyURI(configs.URI),
	// options.Client().SetMaxConnIdleTime(time.Duration(configs.IdleConnTimeout)*time.Second),
	// options.Client().SetMaxPoolSize(configs.MaxPoolSize),
	)
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Second)
	defer cancel()

	err = dbClient.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	ctx, conCancel := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Second)
	err = dbClient.Ping(ctx, nil)
	defer conCancel()
	if err != nil {
		log.Fatal("fail to connect to DB: " + err.Error())
	}

	return &DBService{
		DBClient: dbClient,
		timeout:  timeout,
	}
}

// Collections
func (dbService *DBService) collectionRef() *mongo.Collection {
	return dbService.DBClient.Database("image-labels").Collection("image-labels")
}

// DB utils
func (dbService *DBService) getContext() (ctx context.Context, cancel context.CancelFunc) {
	return context.WithTimeout(context.Background(), time.Duration(dbService.timeout)*time.Second)
}
