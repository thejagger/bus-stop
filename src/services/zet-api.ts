import {ZetManager} from "@tranzithr/zet-api";
import type {Stop, Route} from "@tranzithr/zet-api/dist/core/parsers";

// Infer return type from ZetManager method
type StopIncomingTripWithDates = Awaited<ReturnType<ZetManager["getStopIncomingTrips"]>>[number];

/**
 * ZET API Service Wrapper
 * Provides methods to interact with the ZET (Zagreb Electric Tram) API
 */
class ZetApiService {
  private zetManager: ZetManager;

  constructor() {
    // Initialize with 5 minute cache for static data (routes, stops)
    this.zetManager = new ZetManager(5 * 60 * 1000);
  }

  /**
   * Login to ZET API using credentials from environment variables
   * Registration is not available via API (returns Method Not Allowed)
   * Users must register manually through the ZET website
   */
  async login(): Promise<void> {
    const email = import.meta.env.VITE_ZET_API_EMAIL;
    const password = import.meta.env.VITE_ZET_API_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ZET API credentials not found. Please set VITE_ZET_API_EMAIL and VITE_ZET_API_PASSWORD in your .env.local file. " +
        "You need to register manually at the ZET website first."
      );
    }

    try {
      await this.zetManager.authManager.login({
        username: email,
        password: password,
      });
    } catch (error: any) {
      console.error("Error logging in to ZET API:", error);
      // Provide more helpful error messages
      if (error.message?.includes("Method Not Allowed")) {
        throw new Error(
          "ZET API login endpoint may not be available. Please check the API documentation or contact support."
        );
      }
      if (error.message?.includes("Unauthorized") || error.message?.includes("Invalid credentials")) {
        throw new Error(
          "Invalid ZET API credentials. Please check your email and password in .env.local"
        );
      }
      throw error;
    }
  }

  /**
   * Register a new account (may not be available via API)
   * @deprecated Registration returns "Method Not Allowed" - users must register manually
   */
  async register(): Promise<void> {
    const email = import.meta.env.VITE_ZET_API_EMAIL || "jackpot.auer@gmail.com";
    const password = import.meta.env.VITE_ZET_API_PASSWORD || "KYgPZ7xTIxLDRvcp9Oq8";

    try {
      await this.zetManager.authManager.register({
        email,
        password,
        confirmPassword: password,
      });
    } catch (error: any) {
      console.error("Error registering with ZET API:", error);
      // Registration is not available via API
      if (error.message?.includes("Method Not Allowed")) {
        throw new Error(
          "Registration is not available via API. Please register manually at the ZET website, " +
          "then add your credentials to .env.local as VITE_ZET_API_EMAIL and VITE_ZET_API_PASSWORD"
        );
      }
      throw error;
    }
  }

  /**
   * Get all stops from ZET API
   */
  async getStops(): Promise<Stop[]> {
    try {
      return await this.zetManager.getStops();
    } catch (error) {
      console.error("Error fetching stops from ZET API:", error);
      throw error;
    }
  }

  /**
   * Search for stops by name
   */
  async searchStops(query: string, limit: number = 50): Promise<Stop[]> {
    try {
      return await this.zetManager.searchStops({query, limit});
    } catch (error) {
      console.error("Error searching stops from ZET API:", error);
      throw error;
    }
  }

  /**
   * Get a stop by ID
   */
  async getStopById(stopId: string): Promise<Stop | null> {
    try {
      return await this.zetManager.getStopById(stopId);
    } catch (error) {
      console.error("Error fetching stop from ZET API:", error);
      throw error;
    }
  }

  /**
   * Get incoming trips for a stop (arrivals)
   */
  async getStopIncomingTrips(stopId: string): Promise<StopIncomingTripWithDates[]> {
    try {
      return await this.zetManager.getStopIncomingTrips({stopId});
    } catch (error) {
      console.error("Error fetching incoming trips from ZET API:", error);
      throw error;
    }
  }

  /**
   * Get all routes from ZET API
   */
  async getRoutes(): Promise<Route[]> {
    try {
      return await this.zetManager.getRoutes();
    } catch (error) {
      console.error("Error fetching routes from ZET API:", error);
      throw error;
    }
  }

  /**
   * Get a route by ID
   */
  async getRouteById(routeId: number): Promise<Route | null> {
    try {
      return await this.zetManager.getRouteById(routeId);
    } catch (error) {
      console.error("Error fetching route from ZET API:", error);
      throw error;
    }
  }

  /**
   * Get trips for a route
   */
  async getRouteTrips(routeId: number, daysFromToday: number = 0) {
    try {
      return await this.zetManager.getRouteTrips({routeId, daysFromToday});
    } catch (error) {
      console.error("Error fetching route trips from ZET API:", error);
      throw error;
    }
  }

  /**
   * Refresh cache (useful after syncing data)
   */
  async refreshCache(): Promise<void> {
    await this.zetManager.refreshCache();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.zetManager.clearCache();
  }
}

// Export singleton instance
export const zetApi = new ZetApiService();
