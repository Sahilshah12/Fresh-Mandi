package com.freshmandi.app.di

import android.content.Context
import com.freshmandi.app.data.api.FreshMandiApiService
import com.freshmandi.app.data.api.RetrofitClient
import com.freshmandi.app.data.database.FreshMandiDatabase
import com.freshmandi.app.data.repository.*
import com.freshmandi.app.utils.PreferenceManager
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Singleton
    @Provides
    fun provideContext(@ApplicationContext context: Context): Context = context

    @Singleton
    @Provides
    fun providePreferenceManager(@ApplicationContext context: Context): PreferenceManager {
        return PreferenceManager(context)
    }

    @Singleton
    @Provides
    fun provideFreshMandiDatabase(@ApplicationContext context: Context): FreshMandiDatabase {
        return FreshMandiDatabase.getDatabase(context)
    }

    @Singleton
    @Provides
    fun provideApiService(@ApplicationContext context: Context): FreshMandiApiService {
        return RetrofitClient.getApiService(context)
    }

    @Singleton
    @Provides
    fun provideUserDao(db: FreshMandiDatabase) = db.userDao()

    @Singleton
    @Provides
    fun provideProductDao(db: FreshMandiDatabase) = db.productDao()

    @Singleton
    @Provides
    fun provideOrderDao(db: FreshMandiDatabase) = db.orderDao()

    @Singleton
    @Provides
    fun provideReviewDao(db: FreshMandiDatabase) = db.reviewDao()

    @Singleton
    @Provides
    fun provideNotificationDao(db: FreshMandiDatabase) = db.notificationDao()

    @Singleton
    @Provides
    fun provideAuthRepository(
        apiService: FreshMandiApiService,
        userDao: com.freshmandi.app.data.database.UserDao
    ): AuthRepository {
        return AuthRepository(apiService, userDao)
    }

    @Singleton
    @Provides
    fun provideProductRepository(
        apiService: FreshMandiApiService,
        productDao: com.freshmandi.app.data.database.ProductDao
    ): ProductRepository {
        return ProductRepository(apiService, productDao)
    }

    @Singleton
    @Provides
    fun provideFarmerRepository(
        apiService: FreshMandiApiService,
        productDao: com.freshmandi.app.data.database.ProductDao,
        orderDao: com.freshmandi.app.data.database.OrderDao
    ): FarmerRepository {
        return FarmerRepository(apiService, productDao, orderDao)
    }

    @Singleton
    @Provides
    fun provideOrderRepository(
        apiService: FreshMandiApiService,
        orderDao: com.freshmandi.app.data.database.OrderDao
    ): OrderRepository {
        return OrderRepository(apiService, orderDao)
    }

    @Singleton
    @Provides
    fun provideReviewRepository(
        apiService: FreshMandiApiService,
        reviewDao: com.freshmandi.app.data.database.ReviewDao
    ): ReviewRepository {
        return ReviewRepository(apiService, reviewDao)
    }
}
